import React, { Component } from 'react';
import { Text,TextInput , View, StyleSheet,ScrollView,FlatList, Picker, Switch, Button, Modal, PanResponder } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
	 postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
		<Animatable.View animation="fadeInUp" duration={2000} delay={1000}>      
			<Card title='Comments' >
			<FlatList 
				data={comments}
				renderItem={renderCommentItem}
				keyExtractor={item => item.id.toString()}
				/>
			</Card>
		</Animatable.View>	
    );
}

function RenderDish(props) {
    const dish = props.dish;

    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if ( dx > 200 ) return true;
        else return false;
    }
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},
        onPanResponderEnd: (e, gestureState) => {
            if (recognizeComment(gestureState))
                props.openCommentBox();
            return true;
        }
    });

    handleViewRef = ref => this.view = ref;
    if (dish != null) {
        return(
              <Animatable.View animation="fadeInDown" duration={2000} delay={1000} ref={this.handleViewRef} {...panResponder.panHandlers}>
                <Card featuredTitle={dish.name} image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={styles.buttons}>
                      <Icon raised reverse name={props.favorite?'heart':'heart-o'} type='font-awesome' color='#f50' onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}/>
                      <Icon raised reverse name={'pencil'} type='font-awesome' color='#512DA8' onPress={() => props.openCommentBox()}/>
                    </View>
                </Card>
              </Animatable.View>
            );
        }
        else {
            return(<View></View>);
        }
}


class DishDetail extends Component {

    constructor(props) {
        super(props);
       this.state = {
            dishes: DISHES,
            comments: COMMENTS,
            favorites: [],
			showModal: false,
			rating: '',
            author: '',
            comment: ''
        };
    }

    static navigationOptions = {
        title: 'Dish Details'
    };
	
	toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }
	
	markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }
	submitComment() {
        const dishId = this.props.navigation.getParam('dishId','');
		this.props.postComment(dishId,
                             this.state.rating,
                             this.state.author,
                             this.state.comment);
		this.toggleModal();
    }
	
	ratingCompleted(rating){
		this.setState({comment: {rating}});
	}
	ratingTextChange(fld){
		
	}
	
    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
			<ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
					openCommentBox={() => this.toggleModal()}
                    onPress={() => this.markFavorite(dishId)} 
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
				<Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>
                    <View style = {styles.modal}>
						<View style={ styles.modalText }>
							<Rating 
							showRating 
							fractions={1}
							startingValue={3.3}
							onFinishRating={ rating => this.setState({ rating: rating })}/>
						</View>
						<View style={ styles.modalText }>
							<Input  placeholder = 'Author'
                                leftIcon={
                                    <Icon name = 'user-o' type = 'font-awesome' size = { 20 }/>
                                }
                                onChangeText = { author => this.setState({ author })}/>
						</View>
						<View style={ styles.modalText }>	
							<Input  placeholder = 'Comment'
                                leftIcon={
                                    <Icon name = 'comment-o' type = 'font-awesome' size = { 20 }/>
                                }
                                onChangeText = { comment => this.setState({ comment })}/>
						</View>
						<View style={ styles.modalText }>
							<Button 
								onPress = {() =>{this.submitComment();}}
								color="#512DA8"
								title="submit" 
								/>
						</View>
						<View style={ styles.modalText }>		
							<Button 
								onPress = {() =>{this.toggleModal();}}
								color="#ccc"
								title="Cancel" 
								/>	
						</View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({  
	modal: {
       justifyContent: 'center',
       margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    },
	buttons: {
		alignItems: 'center',
		flexDirection: 'row',
		flex: 1,
		margin:20
	}
});
export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
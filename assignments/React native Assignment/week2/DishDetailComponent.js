import React, { Component } from "react"
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Button,
  Modal,
  FlatList,
} from "react-native"
import { Card, Icon, Rating, Input } from "react-native-elements"
import { connect } from "react-redux"
import { baseUrl } from "../shared/baseUrl"
import { postFavorite, postComment } from "../redux/ActionCreators"

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites,
  }
}

const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) =>
    dispatch(postComment(dishId, rating, author, comment)),
})

function RenderDish(props) {
  const dish = props.dish

  if (dish != null) {
    return (
      <Card featuredTitle={dish.name}>
        <Card.Title>{dish.name}</Card.Title>
        <Card.Image source={{ uri: baseUrl + dish.image }}></Card.Image>
        <Text style={{ margin: 10 }}>{dish.description}</Text>
        <View style={styles.formRow}>
          <Icon
            raised
            reverse
            style={{ flex: 2 }}
            name={props.favorite ? "heart" : "heart-o"}
            type="font-awesome"
            color="#f50"
            onPress={() =>
              props.favorite ? console.log("Already Favorite") : props.onPress()
            }
          ></Icon>
          <Icon
            raised
            style={{ flex: 2 }}
            reverse
            name="pencil"
            type="font-awesome"
            color="#0000FF"
            onPress={() => props.onPressPostComment()}
          ></Icon>
        </View>
      </Card>
    )
  } else {
    return <View></View>
  }
}

function RenderComments(props) {
  const comments = props.comments
  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Rating
          imageSize={20}
          readonly
          startingValue={parseFloat(item.rating)}
        />

        <Text style={{ fontSize: 12 }}>
          {"--" + item.author + ", " + item.date}
        </Text>
      </View>
    )
  }

  return (
    <Card>
      <Card.Title>Comments</Card.Title>
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id.toString()}
      ></FlatList>
    </Card>
  )
}

class DishDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      comment: "",
      author: "",
      rating: 3.5,
    }
  }
  handleComment(dishId, rating, author, comment) {
    console.log(JSON.stringify(this.state))
    this.props.postComment(dishId, rating, author, comment)
    this.toggleModal()
    console.log("Comentario anadido")
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal })
  }

  resetForm() {
    this.setState({
      guests: 1,
      smoking: false,
      date: "",
      showModal: false,
    })
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId)
  }
  render() {
    const dishId = this.props.route.params.dishId
    return (
      <ScrollView>
        {/* Some dice que el favorite sera true si existe */}
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some((el) => el === dishId)}
          onPress={() => this.markFavorite(dishId)}
          onPressPostComment={() => this.toggleModal()}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            (comment) => comment.dishId === dishId
          )}
        ></RenderComments>

        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => {
            this.toggleModal()
            this.resetForm()
          }}
          onRequestClose={() => {
            this.toggleModal()
            this.resetForm()
          }}
        >
          <View style={styles.modal}>
            <Rating
              showRating
              fractions={1}
              startingValue={this.state.rating}
              onFinishRating={(value) => this.setState({ rating: value })}
            />
            <Input
              placeholder="Author"
              leftIcon={
                <Icon name="user" size={24} type="font-awesome" color="black" />
              }
              onChangeText={(value) => this.setState({ author: value })}
            />
            <Input
              placeholder="Comment"
              leftIcon={
                <Icon
                  name="comment"
                  size={24}
                  type="font-awesome"
                  color="black"
                />
              }
              onChangeText={(value) => this.setState({ comment: value })}
            />
          </View>
          <View>
            <Button
              title="Submit"
              type="solid"
              color="#512DA8"
              onPress={() =>
                this.handleComment(
                  dishId,
                  this.state.rating,
                  this.state.author,
                  this.state.comment
                )
              }
            ></Button>
          </View>

          <View>
            <Button
              title="Cancel"
              color="#808080"
              onPress={() =>
                this.setState({
                  comment: "",
                  author: "",
                  rating: 3.5,
                  showModal: false,
                })
              }
            ></Button>
          </View>
        </Modal>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  formRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20,
  },
  formLabel: {
    fontSize: 18,
    flex: 2,
  },
  formItem: {
    flex: 1,
  },
  modal: {
    justifyContent: "center",
    margin: 20,
  },
  modalTittle: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#512DA8",
    textAlign: "center",
    color: "white",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    margin: 10,
  },
})
export default connect(mapStateToProps, mapDispatchToProps)(DishDetail)

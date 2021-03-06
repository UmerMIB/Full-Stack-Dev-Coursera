import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Modal,
  Row,
  Label,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { Loading } from "./LoadingComponent";
import "font-awesome/css/font-awesome.css";
import { Link } from "react-router-dom";
import { Control, Errors, LocalForm } from "react-redux-form";
import { baseUrl } from "../shared/baseUrl";
import { FadeTransform, Fade, Stagger } from "react-animation-components";

function RenderDish({ dish }) {
  if (dish != null)
    return (
      <FadeTransform
        in
        transformProps={{
          exitTransform: "scale(0.5) translateY(-50%)",
        }}
      >
        <Card>
          <CardImg top src={baseUrl + dish.image} alt={dish.name} />
          <CardBody>
            <CardTitle>{dish.name}</CardTitle>
            <CardText>{dish.description}</CardText>
          </CardBody>
        </Card>
      </FadeTransform>
    );
  else return <div></div>;
}

function RenderComments({ comments, postComment, dishId }) {
  if (comments.length) {
    return (
      <div className="col-12 col-md-5 m-1">
        <h4>Comments</h4>
        <ul className="list-unstyled">
          <Stagger in>
            {comments.map((comment) => {
              return (
                <Fade in>
                  <li key={comment.id}>
                    <p>{comment.comment}</p>
                    <p>
                      -- {comment.author} ,{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      }).format(new Date(Date.parse(comment.date)))}
                    </p>
                  </li>
                </Fade>
              );
            })}
          </Stagger>

          <CommentForm dishId={dishId} postComment={postComment} />
        </ul>
      </div>
    );
  } else return <div></div>;
}

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openCommentModal: false,
    };

    this.openCommentModalFunc = this.openCommentModalFunc.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  openCommentModalFunc = () => {
    this.setState({ openCommentModal: !this.state.openCommentModal });
  };

  handleSubmit(values) {
    this.openCommentModalFunc();
    console.log("Current State is: " + JSON.stringify(values));
    alert("Current State is: " + JSON.stringify(values));
    this.props.postComment(
      this.props.dishId,
      values.rating,
      values.author,
      values.comment
    );
    // event.preventDefault();
  }

  render() {
    const required = (val) => val && val.length;
    const maxLength = (len) => (val) => !val || val.length <= len;
    const minLength = (len) => (val) => val && val.length >= len;
    return (
      <>
        <Button outline color="secondary" onClick={this.openCommentModalFunc}>
          <i className="fa fa-edit fa-lg"></i>Submit Comment
        </Button>
        <Modal
          isOpen={this.state.openCommentModal}
          centered
          toggle={this.openCommentModalFunc}
        >
          <ModalHeader toggle={this.openCommentModalFunc}>
            Submit Comments
          </ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
              <Row className="form-group">
                <Label md={12}>
                  Rating
                  <Control.select
                    model=".rating"
                    id="rating"
                    name="rating"
                    placeholder="Rating"
                    className="form-control w-f"
                    validators={{
                      required,
                    }}
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Control.select>
                  <Errors
                    className="text-danger"
                    model=".rating"
                    show="touched"
                    messages={{
                      required: "Required",
                    }}
                  />
                </Label>
              </Row>
              <Row className="form-group">
                <Label xs={12}>
                  Your Name
                  <Control.text
                    model=".author"
                    id="author"
                    name="name"
                    placeholder="Your Name"
                    className="form-control"
                    validators={{
                      required,
                      minLength: minLength(3),
                      maxLength: maxLength(15),
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".name"
                    show="touched"
                    messages={{
                      required: "Required",
                      minLength: "Must be greater than 2 characters",
                      maxLength: "Must be 15 characters or less",
                    }}
                  />
                </Label>
              </Row>
              <Row className="form-group">
                <Label xs={12}>
                  Comment
                  <Control.textarea
                    model=".comment"
                    id="comment"
                    name="comment"
                    rows={6}
                    placeholder="Comment"
                    className="form-control"
                    validators={{
                      required,
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".comment"
                    show="touched"
                    messages={{
                      required: "Required",
                    }}
                  />
                </Label>
              </Row>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </LocalForm>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

const DishDetail = (props) => {
  if (props.isLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  } else if (props.errMess) {
    return (
      <div className="container">
        <div className="row">
          <h4>{props.errMess}</h4>
        </div>
      </div>
    );
  } else if (props.dish != null)
    return (
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/menu">Menu</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            <h3>{props.dish.name}</h3>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-5 m-1">
            <RenderDish dish={props.dish} />
          </div>
          <div className="col-12 col-md-5 m-1">
            <RenderComments
              comments={props.comments}
              postComment={props.postComment}
              dishId={props.dish.id}
            />
          </div>
        </div>
      </div>
    );
};

export default DishDetail;

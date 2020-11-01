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
  Col,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import "font-awesome/css/font-awesome.css";
import { Link } from "react-router-dom";
import { Control, LocalForm, Errors } from "react-redux-form";

function RenderDish({ dish }) {
  if (dish != null)
    return (
      <Card>
        <CardImg top src={dish.image} alt={dish.name} />
        <CardBody>
          <CardTitle>{dish.name}</CardTitle>
          <CardText>{dish.description}</CardText>
        </CardBody>
      </Card>
    );
  else return <div></div>;
}

function RenderComments({ comments }) {
  if (comments.length) {
    const comment = comments.map((comment) => (
      <div className="list-unstyled">
        <li style={{ fontSize: "1rem" }}>{comment.comment}</li>
        <br />
        <li style={{ fontSize: "1rem" }}>{`-- ${
          comment.author
        }, ${new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }).format(new Date(Date.parse(comment.date)))}`}</li>
      </div>
    ));
    return (
      <div>
        {comment}
        <CommentForm />
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
                    model=".name"
                    id="name"
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
          <RenderComments comments={props.comments} />
        </div>
      </div>
    </div>
  );
};

export default DishDetail;

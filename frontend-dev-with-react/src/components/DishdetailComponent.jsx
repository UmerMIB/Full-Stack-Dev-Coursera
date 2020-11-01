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
  }

  openCommentModalFunc = () => {
    this.setState({ openCommentModal: !this.state.openCommentModal });
  };

  handleSubmit(values) {
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
          <i className="fa fa-home fa-lg"></i>Submit Comment
        </Button>
        <Modal
          isOpen={this.state.openCommentModal}
          centered
          onClosed={this.openCommentModal}
        >
          <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
            <Row className="form-group p-2">
              <Col>
                <Label>
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
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
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
              </Col>
            </Row>
            <Row className="form-group">
              <Label md={2}>
                Your Name
                <Col>
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
                </Col>
              </Label>
            </Row>
            <Row className="form-group">
              <Label md={2}>
                Comment
                <Col md={10}>
                  <Control.textarea
                    model=".rating"
                    id="rating"
                    name="rating"
                    placeholder="First Name"
                    className="form-control"
                    validators={{
                      required,
                      minLength: minLength(3),
                    }}
                  />
                  <Errors
                    className="text-danger"
                    model=".rating"
                    show="touched"
                    messages={{
                      required: "Required",
                      minLength: "Must be greater than 2 characters",
                      maxLength: "Must be 15 characters or less",
                    }}
                  />
                </Col>
              </Label>
            </Row>
          </LocalForm>
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

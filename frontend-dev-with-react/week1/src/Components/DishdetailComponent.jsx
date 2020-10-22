import React from "react";
import { Card, CardImg, CardText, CardBody, CardTitle } from "reactstrap";

function renderDish(dish) {
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

function renderComments(comments) {
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
    return comment;
  } else return <div></div>;
}
const DishDetail = (props) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-5 m-1">
          {renderDish(props.dish)}
        </div>
        {props.dish ? (
          <div className="col-xs-12 col-sm-12 col-md-5 m-1">
            <h2>Comments</h2>
            {renderComments(props.dish.comments)}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default DishDetail;

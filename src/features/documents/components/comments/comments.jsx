import { useEffect, useState } from "react";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";
import CreateComment from "./create-comment";
import ReplyComment from "./reply-comment";
import useAuthToken from "../../../hooks/use-authToken";
import { useTranslation } from "react-i18next";

const Comments = ({ id }) => {
  const { t } = useTranslation();
  const [commentsData, setCommentsData] = useState([]);
  const [reply, setReply] = useState(false);
  const { authToken } = useAuthToken();
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const httpInterceptedService = useHttpInterceptedService();

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const Response = await httpInterceptedService.get(
          `/comment/getAllCommentsBySendDocId/${id}`
        );
        if (Response && Response.data) {
          setCommentsData(Response.data);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id]);

  const onUpdateComments = async () => {
    try {
      const Response = await httpInterceptedService.get(
        `/comment/getAllCommentsBySendDocId/${id}`
      );
      if (Response && Response.data) {
        setCommentsData(Response.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleReply = (commentId) => {
    setReply(true);
    setSelectedCommentId(commentId);
  };

  return (
    <div className="card" style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
      <div className="card-body">
        {commentsData.map((comment) => {
          const convertedCommentDate = new Date(comment.commentDateTime)
            .toLocaleTimeString("fa-Persian", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              calendar: "islamic-umalqura",
            })
            .replace(/\//g, "-");
          return (
            <div className="row border-bottom mb-2" key={comment.commentId}>
              {comment.parentId && (
                <div className="row bg-light">
                  <span>{comment.parent_commenter}</span>
                  <span> {comment.parentText}</span>
                </div>
              )}
              <div className="col-lg-3 col-md-4 label d-flex flex-column">
                <span className="text-primary">{comment.commenterName}</span>
                <span> {comment.commenterDepartment}</span>
                <span> {convertedCommentDate}</span>
              </div>
              <div className="col-lg-9 col-md-8">
                <p>{comment.commentText}</p>
              </div>
              <div className="d-flex justify-content-end my-2">
                {authToken?.roles.includes("reply_comment") && (
                  <button
                    onClick={() => handleReply(comment.commentId)}
                    className="btn btn-lg btn-info"
                  >
                    {t("comment.reply")}
                  </button>
                )}
              </div>
              {reply && comment.commentId === selectedCommentId && (
                <div className="my-2">
                  <ReplyComment
                    onUpdateComments={onUpdateComments}
                    parentCommentId={comment.commentId}
                    setReply={setReply}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {authToken?.roles.includes("comment_add") && (
        <div className="card-footer">
          <CreateComment onUpdateComments={onUpdateComments} />
        </div>
      )}
    </div>
  );
};

export default Comments;

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";

const ReplyComment = ({ onUpdateComments, parentCommentId, setReply }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const httpInterceptedService = useHttpInterceptedService();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const onSubmit = async (data) => {
    try {
      data.parentCommentId = parentCommentId;
      data.sendDocId = id;
      await httpInterceptedService.post("/comment/add", data);
      reset({ commentText: "" });
      setReply(false);
      toast.success(t("toast.commentReplySuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      onUpdateComments();
    } catch (error) {
      toast.error(t("toast.commentReplyFailure"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  return (
    <div style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
      <textarea
        rows={3}
        placeholder={t("comment.replyPlaceholder")}
        {...register("commentText", {
          required: t("comment.validation.commentTextRequired"),
          pattern: {
            value: /^[a-zA-Z0-9\u0600-\u06FF\s.]+$/,
            message: t("register.validation.inputPattern"),
          },
        })}
        className={`form-control ${errors.commentText && "is-invalid"}`}
      />
      {errors.commentText && (
        <p className="text-danger small fw-bolder mt-1">
          {errors.commentText?.message}
        </p>
      )}
      <button
        className="btn btn-lg btn-outline-dark mt-2 mx-2"
        onClick={() => setReply(false)}
      >
        {t("filter.cancel")}
      </button>
      <button
        className="btn btn-lg btn-primary mt-2"
        onClick={handleSubmit(onSubmit)}
      >
        {t("comment.replyAdd")}
      </button>
    </div>
  );
};

export default ReplyComment;

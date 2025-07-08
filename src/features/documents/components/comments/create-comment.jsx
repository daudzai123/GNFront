import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import useHttpInterceptedService from "../../../hooks/use-httpInterceptedService";

const CreateComment = ({ onUpdateComments }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const httpInterceptedService = useHttpInterceptedService();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {},
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    try {
      data.sendDocId = id;
      await httpInterceptedService.post("/comment/add", data);
      reset({ commentText: "" });
      toast.success(t("toast.commentAddSuccess"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      onUpdateComments();
    } catch (error) {
      toast.error(t("toast.commentAddFailure"), {
        position: toast.POSITION.BOTTOM_LEFT,
      });
    }
  };

  return (
    <div style={{ fontFamily: "'Yakan', 'Lalezar', sans-serif" }}>
      <textarea
        rows={3}
        placeholder={t("comment.placeholder")}
        {...register("commentText", {
          required: t("comment.validation.commentTextRequired"),
          pattern: {
            value: /^[a-zA-Z0-9\u0600-\u06FF\s.]+$/,
            message: t("register.validation.inputPattern"),
          },
        })}
        className={`form-control form-control-lg ${
          errors.commentText
            ? "is-invalid"
            : touchedFields.commentText
            ? "is-valid"
            : ""
        }`}
      />
      {errors.commentText && (
        <p className="text-danger small fw-bolder mt-1">
          {errors.commentText?.message}
        </p>
      )}
      <button
        className="btn btn-lg btn-primary mt-2"
        onClick={handleSubmit(onSubmit)}
      >
        {t("comment.commentAdd")}
      </button>
    </div>
  );
};

export default CreateComment;

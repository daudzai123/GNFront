const Loading = ({ theme }) => {
  return (
    <div className="d-flex justify-content-center mt-3">
      <div
        className={`loading spinner-border text-${theme || "primary"}`}
      ></div>
    </div>
  );
};

export default Loading;

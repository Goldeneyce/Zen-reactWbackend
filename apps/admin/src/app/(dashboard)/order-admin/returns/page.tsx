import ReturnsClient from "./ReturnsClient";

const ReturnsPage = () => {
  return (
    <div>
      <div className="mb-6 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold text-lg">Returns, Refunds & Exchanges</h1>
        <p className="text-sm text-muted-foreground">Process and track return requests, refunds, and exchanges</p>
      </div>
      <ReturnsClient />
    </div>
  );
};

export default ReturnsPage;

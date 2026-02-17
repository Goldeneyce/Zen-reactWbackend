import ReportsClient from "./ReportsClient";

const ReportsPage = () => {
  return (
    <div>
      <div className="mb-6 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold text-lg">Data & Reporting</h1>
        <p className="text-sm text-muted-foreground">Comprehensive order analytics, revenue reports, and customer insights</p>
      </div>
      <ReportsClient />
    </div>
  );
};

export default ReportsPage;

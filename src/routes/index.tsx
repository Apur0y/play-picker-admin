import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DashboardLayout from "../components/layouts/Dashboard";
import NotFound from "../components/notFound/NotFound";
import AuthLayout from "../components/feature/auth/AuthLayout";
import AuthSide from "../components/feature/auth/AuthSide";
import SignInPage from "../components/feature/auth/SignIn";
import ForgetPassPage from "../components/feature/auth/ForgetPass";
import OtpVerification from "../components/feature/auth/Otp";
import ResetPasswordPage from "../components/feature/auth/ResetPassword";
import Overview from "../components/feature/overview/Overview";
import ReportList from "../components/feature/reports/ReportList";
import PatientList from "../components/feature/patients/Patients";
import ProfileSettings from "../components/feature/settings/Settings";
import MedicalReport from "../components/feature/report-overview/ReportOverview";
import SubscriptionPlan from "../components/feature/plan/Plan";
import AdminNewsletter from "../components/feature/newslatter/NewsLatter";
import SportsVideos from "../components/feature/sports/SportsVideos";

const RouterProvider: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<AuthLayout fullWidthSide sideComponent={<AuthSide />} />}
        >
          <Route index={true} element={<SignInPage />} />
    
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="otp" element={<OtpVerification />} />
          <Route path="forget-password" element={<ForgetPassPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route
            index={true}
            element={<Overview  />}
          />
          <Route
            path="reports"
            element={<ReportList  />}
          />
          <Route
            path="report/:id"
            element={<MedicalReport  />}
          />
          <Route
            path="patients"
            element={<PatientList  />}
          />
          <Route
            path="plan"
            element={<SubscriptionPlan  />}
          />
          <Route
            path="sports"
            element={<SportsVideos  />}
          />
          <Route
            path="newsletter"
            element={< AdminNewsletter />}
          />
          <Route
            path="settings"
            element={<ProfileSettings  />}
          />
          

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default RouterProvider;

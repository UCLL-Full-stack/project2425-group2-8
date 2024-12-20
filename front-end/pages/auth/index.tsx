import AuthToggle from "../../components/auth/AuthToggle";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AuthToggle />
    </div>
  );
};

import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default AuthPage;

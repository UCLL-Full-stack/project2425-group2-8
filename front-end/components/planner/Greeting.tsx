import { Coffee, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

type GreetingProps = {
  user: { name: string } | null;
};

const Greeting: React.FC<GreetingProps> = ({ user }) => {
  const { t } = useTranslation("common");
  const [greeting, setGreeting] = useState("");
  const [greetingIcon, setGreetingIcon] = useState(<Sun />);

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting(t("goodMorning"));
      setGreetingIcon(<Coffee className="h-6 w-6" />);
    } else if (hour >= 12 && hour < 18) {
      setGreeting(t("goodAfternoon"));
      setGreetingIcon(<Sun className="h-6 w-6" />);
    } else {
      setGreeting(t("goodEvening"));
      setGreetingIcon(<Moon className="h-6 w-6" />);
    }
  }, [t]);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <article className="flex items-center py-2 px-0 w-full">
      <div className="flex items-center text-gray-600">
        {greetingIcon}
        <p className="ml-2 text-lg font-semibold m-0">
          {greeting},{" "}
          <span className="font-bold">
            {user
              ? user.name === "guest"
                ? "Guest"
                : capitalizeFirstLetter(user.name)
              : ""}
          </span>
          !
        </p>
      </div>
    </article>
  );
};

export default Greeting;

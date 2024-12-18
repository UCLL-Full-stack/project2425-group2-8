import { Coffee, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

type GreetingProps = {
  user: { name: string } | null;
};

const Greeting: React.FC<GreetingProps> = ({ user }) => {
  const [greeting, setGreeting] = useState("");
  const [greetingIcon, setGreetingIcon] = useState(<Sun />);

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      setGreeting(`Good morning`);
      setGreetingIcon(<Coffee className="h-6 w-6" />);
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
      setGreetingIcon(<Sun className="h-6 w-6" />);
    } else {
      setGreeting("Good evening");
      setGreetingIcon(<Moon className="h-6 w-6" />);
    }
  }, []);

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
            {user ? capitalizeFirstLetter(user.name) : ""}
          </span>
          !
        </p>
      </div>
    </article>
  );
};

export default Greeting;

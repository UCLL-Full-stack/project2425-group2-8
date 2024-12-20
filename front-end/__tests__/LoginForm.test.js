import React from "react";
import { render, screen } from "@testing-library/react";
import LoginForm from "../components/auth/LoginForm";

window.React = React;

test("renders LoginForm with correct text", async () => {
  render(<LoginForm />);
  const element = screen.getByText(/LoginForm text/i);
  expect(element).toBeInTheDocument();
});

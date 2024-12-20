import React from "react";
import { render, screen } from "@testing-library/react";
import CalendarDay from "../components/planner/calendar/CalendarDay";

window.React = React;

test("renders CalendarDay with correct text", async () => {
  render(<CalendarDay />);
  const element = screen.getByText(/CalendarDay text/i);
  expect(element).toBeInTheDocument();
});

import React from "react";
import Calendar from "../assets/Calender";
const DateButton = () => {
  const today = new Date();

  const fullFormat = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const weekday = today.toLocaleDateString("en-US", { weekday: "short" });
  const day = today.getDate();
  const mobileFormat = `${weekday}, ${day}`;
  return (
    <button
      type="button"
      class="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none inline-flex items-center cursor-pointer"
    >
      <span className="hidden sm:inline text-gray-800">{fullFormat}</span>

      <span className="text-xs font-bold sm:hidden text-gray-800 text-nowrap">{mobileFormat}</span>
      <Calendar className="hidden sm:inline w-5 h-5 text-blue-500 ml-2" />
    </button>
  );
};

export default DateButton;

import { useState } from "react";
import AddStudent from "../components/AddStudent";
import Calender from "../components/Calender";
import Header from "../components/Header";

function CalenderPage() {
  const [studentAdd, setStudentAdd] = useState(false);
  return (
    <div className=" flex flex-col justify-start items-center gap-2 h-screen bg-white ">
      <Header setStudentAdd={setStudentAdd} />
      <Calender />
      <AddStudent studentAdd={studentAdd} setStudentAdd={setStudentAdd} />
    </div>
  );
}

export default CalenderPage;

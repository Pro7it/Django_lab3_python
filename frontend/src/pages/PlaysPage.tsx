import { NavLink, Outlet } from "react-router-dom";

function PlaysPage() {
  const plays = [1, 2, 3, 4, 5];
  return (
    <div>
      <h1> Super plays</h1>
      {plays.map((play) => (
        <NavLink
          key={play}
          to={`${play}`}
          style={({ isActive }) => ({
            backgroundColor: isActive ? "red" : "",
          })}
        >
          Play {play}
          <br />
        </NavLink>
      ))}
      <Outlet />
    </div>
  );
}

export default PlaysPage;

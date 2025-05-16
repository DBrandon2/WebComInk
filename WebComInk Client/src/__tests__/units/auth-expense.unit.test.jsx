import React from "react";
import { act, render } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import AuthProvider from "../../components/providers/AuthProvider";

describe("Unit - AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("initialise user à null si local storage est vide", () => {
    let ctx;
    const Consumer = () => {
      ctx = React.useContext(AuthContext);
      return null;
    };
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    expect(ctx.user).toBeNull();
  });

  test("la connexion met à jour user et persiste dans localStorage", () => {
    let ctx;
    const Consumer = () => {
      ctx = React.useContext(AuthContext);
      return null;
    };
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    act(() => {
      ctx.login({ username: "Bob" });
    });
    expect(ctx.user).toEqual({ username: "Bob" });
    expect(JSON.parse(localStorage.getItem("user"))).toEqual({
      username: "Bob",
    });
  });
});

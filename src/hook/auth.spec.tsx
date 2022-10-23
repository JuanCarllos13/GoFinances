import { renderHook, act } from "@testing-library/react-hooks";
import { AuthContextProvider } from "../contexts/AuthContext";
import { useAuth } from "./auth";

const mockStartAsync = jest.fn();
jest.mock("expo-auth-session", () => {
  return {
    startAsync: () => mockStartAsync(),
  };
});

jest.mock("expo-apple-authentication", () => ({}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: async () => {},
}));

describe("Auth hook", () => {
  it("should be able to sign in with Google Account existing", async () => {
    mockStartAsync.mockReturnValueOnce({
      type: "success",
      params: {
        access_token: "my-access-token",
      },
      user: {
        id: "any_id",
        email: "juan2017amaral@gmail.com",
        name: "Juan",
        photo: "picture",
      },
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            id: `userInfo.id`,
            email: `userInfo.email`,
            name: `useInfo.given_name`,
            photo: `userInfo.picture`,
            locale: `userInfo.locale`,
            verified_email: `userInfo.verified_email`,
          }),
      })
    ) as jest.Mock;

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthContextProvider,
    });

    await act(() => result.current.signWithGoogle());
    expect(result.current.user?.email).toBe("userInfo.email");
  });

  it("should not connect if cancel authentication with google", async () => {
    mockStartAsync.mockReturnValueOnce({
      type: "cancel",
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthContextProvider,
    });

    await act(() => result.current.signWithGoogle());
    expect(result.current.user).not.toHaveProperty("id");
  });

  it("should be error with incorrectly Google Parameters", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthContextProvider,
    });

    try {
      await act(() => result.current.signWithGoogle());
    } catch {
      expect(result.current.user).toEqual({});
    }
  });
});

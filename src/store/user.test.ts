import { describe,  expect, beforeEach, vi, test } from "vitest";
import { useAuthStore } from "./user";

vi.mock("../axios", () => {
  return {
    default: {
      post: vi.fn().mockResolvedValue({ data: {} }),
      get: vi.fn().mockResolvedValue({ data: {} }),
      put: vi.fn().mockResolvedValue({
        data: {
          success: true,
          data: {
            id: 1,
            title: "Dummy Movie",
            release_date: "2020-01-01",
          },
        },
      }),
      delete: vi.fn(),

      // interceptor stubs (VERY IMPORTANT)
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    },
  };
});

describe("useAuthStore - contentListToggle", () => {
  beforeEach(() => {
    useAuthStore.setState({
      // store top-level lists expected by the implementation
      favorite: [],
      bookmark: [],
      recent: [],
      // minimal user object so contentListToggle doesn't early-return
      user: {
        _id: "user1",
        name: "test",
        email: "test@example.com",
        premiumExpire: "",
        password: "",
        role: "user",
        sessions: [],
        isVerified: true,
        bookmark: [],
        favorite: [],
        recent: [],
        createdAt: "",
        updatedAt: "",
        __v: 0,
      } as any,
    } as any);
  });

  test("adds movie to favorite", async () => {
    const store = useAuthStore.getState();

    await store.contentListToggle({
      type: "favorite",
      flag: "movie",
      id: 1,
      isAdd: true,
    });

    expect(useAuthStore.getState().favorite.length).toBe(1);
    expect(useAuthStore.getState().favorite[0]?.id).toBe(1);
  });

  // removal test can be re-enabled similarly by mocking put for removal response

  test("remove movie from favorite", async () => {
    const store = useAuthStore.getState();

    // First, add the movie to favorite
    await store.contentListToggle({
      type: "favorite",
      flag: "movie",
      id: 1,
      isAdd: true,
    });

    await store.contentListToggle({
      type: "favorite",
      flag: "movie",
      id: 1,
      isAdd: false,
    });

    expect(useAuthStore.getState().favorite.length).toBe(0);
    });
});
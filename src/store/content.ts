import { create } from "zustand";
import api from "../axios";
import type {
  TVSimilar,
  MovieSimilar,
  MovieDetail,
  TVDetail,
} from "../types/content";

export interface MovieContentType {
  adult: boolean;
  backdrop_path: string;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string; // ISO date string
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface GenreType {
  id: number;
  name: string;
}

export interface TVContentType {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  media_type: "tv";
  original_language: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string; // ISO date string (e.g. "2025-08-12")
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

type GenreContentType = {
  movie: { title: string; id: number; data: MovieContentType[] }[];
  tv: { title: string; id: number; data: TVContentType[] }[];
};

type ContentType = "movie" | "tv";

interface ContentState {
  // castMembers: CastMember[];
  isLoading: boolean;
  movieDetail: MovieDetail;
  tvDetail: TVDetail;
  searchedContents: (MovieContentType | TVContentType)[];
  searchKeyword: string;
  genreContent: GenreContentType;
  movie: {
    page: number;
    data: MovieContentType[];
    similar: MovieSimilar[];
    genre: GenreType[];
  };
  tv: {
    page: number;
    data: TVContentType[];
    similar: TVSimilar[];
    genre: GenreType[];
  };
  fetchContent: (contentType: ContentType) => Promise<void>;
  fetchContentDetail: (contentType: ContentType, id: string) => Promise<void>;
  // fetchSpecialContent: (
  //   data: string[],
  //   contentType: "movie" | "tv"
  // ) => Promise<any>;
  searchContent: (payload: { keyword: string; page: number }) => Promise<any>;
  fetchGenres: () => Promise<void>;
  fetchByGenres: ({
    type,
    id,
    page,
  }: {
    type: "movie" | "tv";
    id: string;
    page: number;
  }) => Promise<any>;
  resetSearchKeyword:() => void
  // addSpecialContent:(payload:AddSpecialContentProp) => void
  // removeSpecailContent:(payload:RemoveSpecialContentProp) => void
  // setSpecialContent:(data :SetSpecialContentProp ) => void
}

export const useContentStore = create<ContentState>((set, get) => ({
  // castMembers: [],
  searchKeyword: "",
  searchedContents: [],
  isLoading: true,
  movieDetail: {} as MovieDetail,
  tvDetail: {} as TVDetail,
  genreContent: {
    movie: [],
    tv: [],
  },
  movie: {
    page: 1,
    data: [],
    similar: [],
    genre: [],
  },
  tv: {
    page: 1,
    data: [],
    similar: [],
    genre: [],
  },
  fetchContent: async (contentType = "movie") => {
    let state = get();
    try {
      if (state[contentType].page == 1) {
        set({ isLoading: true });
      } else {
        set({
          [contentType]: {
            ...state[contentType],
            page: state[contentType].page,
            data: [
              ...state[contentType].data,
              ...Array.from({ length: 10 }, () => ({})),
            ],
          },
        });
      }
      let res = await api.get(
        `content/get-all/${state[contentType].page}?content=${contentType}`
      );
      set({
        [contentType]: {
          ...state[contentType],
          page: state[contentType].page,
          data: [
            ...state[contentType].data.filter(
              (e) => Object.keys(e).length !== 0
            ),
          ],
        },
      });
      if (res.data.success) {
        set({
          [contentType]: {
            ...state[contentType],
            page: state[contentType].page + 1,
            data: [...state[contentType].data, ...res.data.data],
          },
        });
      }
    } catch (error) {
      set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchContentDetail: async (contentType, id) => {
    let state = get();
    try {
      set({ isLoading: true });
      let res = await api.get(
        `content/get-detail/${id}?content=${contentType}`
      );
      // let castRes = await api.get(
      //   `content/get-cast/${id}?content=${contentType}`
      // );
      // if (castRes.data.success) {
      //   set({ castMembers: castRes.data.data });
      // }
      let similarRes = await api.get(
        `content/get-similar/${id}?content=${contentType}`
      );
      if (similarRes.data.success) {
        // console.log(similarRes.data.data)
        set({
          [contentType]: {
            ...state[contentType],
            page: state[contentType].page,
            data: state[contentType].data,
            similar: similarRes.data.data.slice(0, 10),
          },
        });
      }

      if (res.data.success) {
        set({ [`${contentType}Detail`]: res.data.data });
      }
    } catch (error) {
      set({ isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
  // fetchSpecialContent: async (data, contentType) => {
  //   try {
  //     let responses = await Promise.all(
  //       data.map((e) =>
  //         api.get(`content/get-detail/${e}?content=${contentType}`)
  //       )
  //     );
  //     const resultData = responses
  //       .filter((res) => res.data.success)
  //       .map((res) => res.data.data);
  //     //  console.log(resultData)
  //     return resultData;
  //   } catch (error) {}
  // },
  searchContent: async ({ keyword, page }) => {
    try {
      let res = await api.get(`content/search/${page}?keyword=${keyword}`);
      // console.log(res)
      // console.log(keyword,page)
      set((state) => {
        return {
          ...state,
          searchedContents: res.data.data,
          searchKeyword: keyword,
        };
      });
      return res.data.success;
      // return res
    } catch (error) {}
  },
  fetchGenres: async () => {
    try {
      const getState = get();
      
function getRandomItems<T>(arr: T[], count: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
}
      // fetch both genres in parallel
      const [movieRes, tvRes] = await Promise.all([
        api.get(`content/get-genres?content=movie`),
        api.get(`content/get-genres?content=tv`),
      ]);

      if (movieRes.data.success && tvRes.data.success) {
        const genresMap: Record<"movie" | "tv", GenreType[]> = {
          movie: getRandomItems(movieRes.data.data,2),
          tv: getRandomItems(tvRes.data.data,2),
        };

        (Object.entries(genresMap) as [ContentType, GenreType[]][]).forEach(
          async ([type, genres]) => {
            const results: { title: string; data: any[] ,id:number}[] = [];

            for (const { id, name } of genres) {
              const res = await getState.fetchByGenres({
                type,
                id: id.toString(),
                page: 1,
              });

              if (res?.success) {
                results.push({ title: name, data: res.data ,id:id });
              }
            }

            // update only once per type, no duplicates
            set((state) => ({
              ...state,
              genreContent: {
                ...state.genreContent,
                [type]: results,
              },
            }));
          }
        );

        set((state) => ({
          ...state,
          movie: { ...state.movie, genre: movieRes.data.data },
          tv: { ...state.tv, genre: tvRes.data.data },
        }));
      }
    } catch (error) {
      console.error(error);
    }
  },

  fetchByGenres: async ({ type, id, page }) => {
    try {
      let res = await api.get(
        `content/genre-filter/${page}?content=${type}&genre=${id}`
      );
      return res.data;
    } catch (error) {}
  },
  resetSearchKeyword:() => {
    const state = get()
    set({...state,searchKeyword:'',searchedContents:[]})
  }

  //   setToken: (token) => set({ accessToken: token }),
}));

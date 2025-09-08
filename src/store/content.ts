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
  id:number;
  name:string;
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


type ContentType = "movie" | "tv";

interface ContentState {
  // castMembers: CastMember[];
  isLoading: boolean;
  movieDetail: MovieDetail;
  tvDetail: TVDetail;
  searchedContents:(MovieContentType | TVContentType)[] ;
  searchKeyword:string;
  
  movie: {
    page: number;
    data: MovieContentType[];
    similar: MovieSimilar[];
    genre:GenreType[];
    
    
  
    
  };
  tv: {
    page: number;
    data: TVContentType[];
    similar: TVSimilar[];
    genre:GenreType[];
    
  
    
  };
  fetchContent: (contentType: ContentType) => Promise<void>;
  fetchContentDetail: (contentType: ContentType, id: string) => Promise<void>;
  // fetchSpecialContent: (
  //   data: string[],
  //   contentType: "movie" | "tv"
  // ) => Promise<any>;
  searchContent:(payload:{keyword:string,page:number}) => Promise<any>;
  fetchGenres : () => Promise<void>  
  fetchByGenres : ({type,id,page}:{type:'movie' | 'tv' ,id:string,page:number}) => Promise<any>  
  // addSpecialContent:(payload:AddSpecialContentProp) => void
  // removeSpecailContent:(payload:RemoveSpecialContentProp) => void
  // setSpecialContent:(data :SetSpecialContentProp ) => void
  
 
}

export const useContentStore = create<ContentState>((set, get) => ({
  // castMembers: [],
  searchKeyword:'',
  searchedContents:[],
  isLoading: true,
  movieDetail: {} as MovieDetail,
  tvDetail: {} as TVDetail,
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
  searchContent:async({keyword,page}) => {
    try {
      
      let res = await api.get(`content/search/${page}?keyword=${keyword}`)
      // console.log(res)
      // console.log(keyword,page)
      set((state) => {
        return {
          ...state,
          searchedContents:res.data.data,
          searchKeyword:keyword,
        }
      })
      return res.data.success
      // return res
    } catch (error) {
      
    }
  },
  fetchGenres:async () => {
    try {
      
      let movieRes = await api.get(`content/get-genres?content=movie`)
      let tvRes = await api.get(`content/get-genres?content=tv`)
      if(movieRes.data.success && tvRes.data.success){
        set( state => {
          return {
            ...state,
            movie:{
              ...state.movie,
              genre:movieRes.data.data
            },
            tv:{
              ...state.tv,
              genre:tvRes.data.data
            }
          }
        })
      }
    } catch (error) {
      
    }
  },
  fetchByGenres:async ({type,id,page}) => {
    try {
      let res =await api.get(`content/genre-filter/${page}?content=${type}&genre=${id}`)
      return res.data
    } catch (error) {
      
    }
  }


  //   setToken: (token) => set({ accessToken: token }),
}));

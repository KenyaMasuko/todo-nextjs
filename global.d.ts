declare namespace NodeJS {
  interface ProcessEnv {
    //環境変数の型を書く
    readonly NEXT_PUBLIC_API_URL: string;
  }
}

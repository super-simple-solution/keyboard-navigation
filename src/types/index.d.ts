export {}

declare global {
  interface Window {
    BMap: any
  }
  type textEnumOptions = {
    [key: string]: string
  }
}

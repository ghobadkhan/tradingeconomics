interface IDictionary<TValue> {
    [id: string]: TValue;
  }
interface IResponse {
    status: string,
    data: Array<IData>
}
interface IData {
    id: number
    indicator: string,
    frequency: Array<string>,
    axes: {
        x: string,
        y: string
    }
    datasets: Array<{
        id: number
        label: string,
        data: Array<{
            x:string, 
            y:number
        }>
    }>
}

export {IDictionary, IResponse, IData}
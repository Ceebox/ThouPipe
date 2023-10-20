export class JSONHelper {

    // Get the time point data from our JSON.
    public static parseData(jsonData: string): TimeData[] {
        
        let data: TimeData[] = [];

        // Read JSON and push it to the array
        const json = JSON.parse(jsonData);
        json.forEach(time => {
            let timeData: TimeData = { time: time };
            data.push(time);
        });

        // Sort array (lowest time => highest time).
        data.sort((a, b) => a.time - b.time);

        return data;
    }
}
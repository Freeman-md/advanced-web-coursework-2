  export class ObjectHelper {
    static removeSerialNumberFromKeys(data: object): object {
      const result = {};

      for (const [key, value] of Object.entries(data)) {
        // Extract the label from the key by removing the prefix number and dot
        const label = key.replace(/^\d+\.\s*/, "");

        // Assign the value to the modified key in the result object
        result[label] = value;
      }

      return result;
    }

    static convertPropertyValuesToFloat(data: object): object {
        const result = {};

        for (const [key, value] of Object.entries(data)) {
          // Convert the value to float if it's a number in string type
          result[key] = typeof value === 'string' && /^\d+(\.\d+)?$/.test(value)
            ? parseFloat(value)
            : value;
        }
      
        return result;
    }

    static chunkArray<T>(arr: T[], chunkSize: number): T[][] {
      const chunks = [];
      for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        chunks.push(chunk);
      }
      return chunks;
    }

    static toJSON(data: object) {
      return JSON.parse(JSON.stringify(data))
    }
  }

  export class StringHelper {}

  export class NumberHelper {}

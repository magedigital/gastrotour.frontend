import axios from 'axios';

export default class DaData {
    constructor({ type = 'all' }) {
        this.token = window.daDataToken;
        this.url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
        this.type = type;
    }

    get(query) {
        return new Promise((resolve, reject) => {
            if (!query) {
                reject();
            } else if (typeof query !== 'string') {
                reject();
            } else {
                const otherQuery =
                    this.type === 'city'
                        ? {
                              from_bound: { value: 'city' },
                              to_bound: { value: 'city' },
                              locations: [
                                  {
                                      city_type_full: 'город',
                                  },
                              ],
                          }
                        : {};

                axios
                    .post(
                        this.url,
                        { query, ...otherQuery },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Accept: 'application/json',
                                Authorization: `Token ${this.token}`,
                            },
                        },
                    )
                    .then((res) => {
                        const { data } = res;

                        const items = data.suggestions
                            .filter((item) => item.value && item.data?.postal_code)
                            .map((item) => `${item.data?.postal_code}, ${item.value}`);
                        const resultItems = [];

                        items.forEach((item) => {
                            if (resultItems.indexOf(item) === -1) {
                                resultItems.push(item);
                            }
                        });

                        resolve(resultItems);
                    });
            }
        });
    }
}

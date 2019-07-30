new Vue({
    el: '#app',
    data: {
        currencies: {},
        amount: 0,
        from: 'EUR',
        to: 'USD',
        result: 0,
        loading: false
    },
    mounted() {
        this.getCurrencies();        
    },
    computed: {
        formattedCurrencies(){
            //convert currencies object to an array --> since data curruency is an empty array
            return Object.values(this.currencies);
        },
        calculateResult(){
            let answer = (Number(this.amount) * this.result).toFixed(3);
            return answer;
        },
        disable(){
            return this.amount === 0 || !this.amount || this.loading;
        }
    },
    methods: {
        getCurrencies(){
            //get the currency from local storage
            const currencies = localStorage.getItem('currencies');

            if(currencies){
                this.currencies = JSON.parse(currencies);

                return;
            }
            else
            {
                axios.get('https://free.currconv.com/api/v7/currencies?apiKey=3bce8c282f15009331bd')
                .then(response => {
                    //console.log(response);
                    this.currencies = response.data.results;

                    localStorage.setItem('currencies', JSON.stringify(response.data.results));
                });
            }
        },
        convertCurrency(){
            const key = `${this.from}_${this.to}`;
            this.loading = true;
            axios.get(`https://free.currconv.com/api/v7/convert?q=${key}&apiKey=3bce8c282f15009331bd`)
            .then((response) => {
                console.log(response);
                this.loading = false;
                this.result = response.data.results[key].val;
            })
        }
    },
    watch: {
       from() {
           this.result = 0;
       },
       to(){
           this.result = 0;
       }
    }
})
    
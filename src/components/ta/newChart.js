import { Doughnut } from 'vue-chartjs'
// import the component - chart you need

export default Doughnut.extend({
  props: ['TA11', 'TA12'],
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart({
      labels: ['TA1', 'TA1-2'],
      datasets: [
        {
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ],
          data: [this.TA11, this.TA12]
        }
      ]
    })
  }
})

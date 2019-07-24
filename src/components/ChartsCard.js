import React, { Fragment } from 'react'
import { Pie } from 'react-chartjs-2'
import { returnCategoryColours } from '../classifier/classifierUtils'

const ChartsCard = (props) => {
  let labels = []
  let chartData = []
  let chartColours = []
  let chartTotals = []
  let categoryColours = returnCategoryColours()

  for (let cat in props.data) {
    labels.push(cat)
    chartData.push(props.data[cat].length)
    chartColours.push(categoryColours[cat])

    let catTotal = 0
    for (let i = 0; i < props.data[cat].length; i++) {
      if (props.data[cat][i].Value < 0) {
        catTotal += Math.abs(props.data[cat][i].Value)
      }
    }

    chartTotals.push(catTotal.toFixed(2))
  }

  const data = {
    labels: labels,
    datasets: [{
      data: chartData,
      backgroundColor: chartColours,
      hoverBackgroundColor: chartColours
    }],
  }

  const options = {
    legend: {
      display: false,
      position: 'left'
    },
    tooltips: {
      callbacks: {
        title: (tooltipItem, data) => {
          return data.labels[tooltipItem[0]['index']]
        },
        label: (tooltipItem) => {
          return '£' + chartTotals[tooltipItem['index']]
        }
      }
    }
  }

  return (
    <Fragment>
      <Pie 
        data={data}
        options={options} />
    </Fragment>
  )
}

export default ChartsCard
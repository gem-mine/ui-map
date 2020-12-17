import React from 'react'

class Counter extends React.Component<{}, {
  count: number
}> {
  state = {
    count: 5
  }

  render() {
    return (
      <div>
        <div>{this.state.count}</div>
        <button onClick={() => this.setState((prevState) => ({ count: prevState.count - 1 }))}>
          减少
        </button>
        <button onClick={() => this.setState((prevState) => ({ count: prevState.count + 1 }))}>
          增加
        </button>
      </div>
    )
  }
}

export default Counter

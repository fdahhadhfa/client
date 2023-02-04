import React, { Component } from "react";

import { APICallback } from "../api/API";

interface LoaderProps {
  methods: Array<(callback: APICallback<any>) => void>;
  children: (data: any[], reload: () => void) => any;
}

class MultiLoader extends Component<LoaderProps> {
  state: {
    errors: string[];
    data0: any;
    data1: any;
    data2: any;
    data3: any;
  } = {
    errors: this.props.methods.map(() => ""),
    data0: null,
    data1: null,
    data2: null,
    data3: null,
  };

  componentDidMount() {
    this.callMethods();
  }

  render() {
    const stateData = [
      this.state.data0,
      this.state.data1,
      this.state.data2,
      this.state.data3,
    ];
    if (stateData.findIndex((e) => e === null) !== -1) {
      return <div style={{ padding: "20px" }}>Идёт загрузка...</div>;
    }

    if (this.state.errors.findIndex((e) => e === null) !== -1) {
      return (
        <div style={{ padding: "20px" }}>
          {this.state.errors.filter((e) => e !== "").join(", ")}
        </div>
      );
    }

    return this.props.children(stateData, () => this.callMethods());
  }

  private callMethods() {
    this.props.methods[0]((response) => {
      if (response.isError()) {
        const errors = [...this.state.errors];
        errors[0] = "Произошла ошибка при загрузке, обновите страницу";
        this.setState({ errors: errors });
      } else {
        const data = response.response!;
        this.setState({ data0: data });
      }
    });

    this.props.methods[1]((response) => {
      if (response.isError()) {
        const errors = [...this.state.errors];
        errors[1] = "Произошла ошибка при загрузке, обновите страницу";
        this.setState({ errors: errors });
      } else {
        const data = response.response!;
        this.setState({ data1: data });
      }
    });

    this.props.methods[2]((response) => {
      if (response.isError()) {
        const errors = [...this.state.errors];
        errors[2] = "Произошла ошибка при загрузке, обновите страницу";
        this.setState({ errors: errors });
      } else {
        const data = response.response!;
        this.setState({ data2: data });
      }
    });

    this.props.methods[3]((response) => {
      if (response.isError()) {
        const errors = [...this.state.errors];
        errors[3] = "Произошла ошибка при загрузке, обновите страницу";
        this.setState({ errors: errors });
      } else {
        const data = response.response!;
        this.setState({ data3: data });
      }
    });
  }
}

export default MultiLoader;

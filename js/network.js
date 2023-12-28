// neural network
class NeuralNetwork {
  constructor(neuronCounts) {
    // neuronCounts is an array of number representing neurons at each layer
    // for example: [3,5,6,8]
    // first value is the input count i.e 3 and the last value is the final output count i.e 8
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);
    // loop through remaining levels

    for (let i = 1; i < network.levels.length; i++) {
      // update outputs - pass previous outputs as inputs to the next level
      outputs = Level.feedForward(outputs, network.levels[i]);
    }
    return outputs;
  }

  // mutate network
  // if amount = 0 then bias and weight stay the same
  static mutate(network, amount = 1) {
    network.levels.forEach((level) => {
      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
      }

      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = lerp(
            level.weights[i][j],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}

// level
class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    // weights is an array of arrays
    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    Level.#randomize(this);
  }

  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1; // random value ranges from -1 to 1
      }
    }

    // biases
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1; // random value ranges from -1 to 1
    }
  }

  // feedForward algorithm - unidirectional flow
  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }
    for (let i = 0; i < level.outputs.length; i++) {
      // calculuate sum
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i]; // input * weight
      }

      if (sum > level.biases[i]) {
        level.outputs[i] = 1; // turn on
      } else {
        level.outputs[i] = 0; // turn off
      }
    }
    return level.outputs;
  }
}

// line equation
// ws + b = 0 (weight*sensorinput + bias)
// weight controls the slope and bias controls y intercept

// plane equation
// when you have 2 sensors you have a plane in 3d space
// w0s0 + w1s1 + b = 0

// hyperlane equation
//  w0s0 + w1s1 + w2s2 + .... + b = 0

// linearly separable versus non-linearly separable

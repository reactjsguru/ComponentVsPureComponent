## Component vs PureComponent

### Practical difference
Practically, `PureComponent` is the same as `Component` in every way except that `PureComponent` already implements the `shouldComponentUpdate` lifecycle callback to check for shallow equality. If the new props being provided to `PureComponent` are the same as the old props, and if the new state is the same as the old state, then the component will not be re-rendered.

The montra is this:
> If a component always renders the exact same way given the same props and state, then that component can be declared as a `PureComponent`, otherwise use `Component`.

#### Example

Given this code:

    class Parent extends Component {
        constructor(props) {
            super(props);
            this.state = {
                first: 1,
                second: 2
            }
        }

        componentDidMount() {
            setInterval(() => this.setState({ first: Math.random() }), 1000);
        }

        render() {
            <div>
                <Child1 first={this.state.first} />
                <Child2 second={this.state.second} />
            </div>
        }
    }

    class Child1 extends Component {
        render() {
            return this.props.first;
        }
    }

    class Child2 extends Component {
        render() {
            return this.props.second;
        }
    }

When the component mounts, it will set the state of `this.state.first` to a random number every 1 second. The expected result is that only the `Child1` component will be re-rendered while nothing happens to `Child2`, however that's not the case. In the above implementation, both `Child1` and `Child2` will be re-rendered every second. To mitigate this so that only `Child1` is re-rendered, we need to declare `Child2` as a `PureComponent`:

    class Child2 extends PureComponent {
        render() {
            return this.props.second;
        }
    }

Now, whenever `this.state.first` is set to a new value, only `Child1` is re-rendered since the props of `Child2` were unchanged.

### Technical difference

The only actual difference from an object standpoint between `Component` and `PureComponent` is the property `isPureReactComponent`. This property is, naturally, only added to the `PureComponent` prototype.

Below is the code from the official React codebase in [ReactBaseClasses.js](https://github.com/facebook/react/blob/9ea55516e674c2de63b9f7829e3c459f3cb3cf78/packages/react/src/ReactBaseClasses.js#L137):

    pureComponentPrototype.isPureReactComponent = true;

So with that in mind, when React is checking to see whether it should actually update a component, it executes the `checkShouldComponentUpdate` function in [ReactFiberClassComponent.js](https://github.com/facebook/react/blob/d328e362e86a6af4a0664e004b8f97f18ce972c8/packages/react-reconciler/src/ReactFiberClassComponent.js#L185). If that function returns `true`, then react will update the component.

In that function, there's code that reads:

    if (ctor.prototype && ctor.prototype.isPureReactComponent) {
        return (
            !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
        );
    }

Now, if you're one of those very curious individuals who wants to know how `shallowEqual` is implemented, simply [take a look for yourself](https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js).

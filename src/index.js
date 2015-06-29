'use strict';

var StickyHeaders = React.createClass({

  getInitialState() {
    return {
      currentStickyIndex: 0
    }
  },

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  handleScroll(e) {
    let index = this.state.currentStickyIndex;
    let currentStickyHeading = this.refs['sticky-heading-' + index];

    if (!currentStickyHeading) {
      return;
    }

    let node = React.findDOMNode(currentStickyHeading);
    let scrollTop = e.srcElement.body.scrollTop;
    let stickyPosition = currentStickyHeading.state.originalOffsetTop;

    if (scrollTop >= stickyPosition) {
      currentStickyHeading.makeSticky();
      this.setState({ currentStickyIndex: index + 1 });
    }
  },

  renderHeadings() {
    if (!this.props.children) {
      return null;
    }

    let index = -1;

    return this.props.children.map(function (item) {
      if (item.type.displayName === 'StickyHeading') {
        index += 1;

        return React.cloneElement(item, {
          key: index,
          isSticky: false,
          offsetTop: 0,
          ref: `sticky-heading-${ index }`
        });
      }

      return item;
    });
  },

  render() {
    return <div className="react-sticky-headings">{this.renderHeadings()}</div>;
  }

});

var StickyHeading = React.createClass({

  displayName: 'StickyHeading',

  propTypes: {
    isSticky: React.PropTypes.bool
  },

  getDefaultProps() {
    return { isSticky: false };
  },

  getInitialState() {
    return {
      isSticky: this.props.isSticky,
      originalOffsetTop: 0
    };
  },

  componentDidMount() {
    this.setState({ originalOffsetTop: React.findDOMNode(this).offsetTop });
  },

  makeSticky() {
    this.setState({ isSticky: true });
  },

  removeSticky() {
    this.setState({ isSticky: false });
  },

  render() {
    let style = this.state.isSticky ? { position: 'fixed', top: 0 } : null;
    let className = this.state.isSticky ? 'is-sticky' : null;
    return (
      <div className={className} style={style}>{this.props.children}</div>
    );
  }

});

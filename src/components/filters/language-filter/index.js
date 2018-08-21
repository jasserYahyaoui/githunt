import React from 'react';
import ReactDOM from 'react-dom';

import classNames from 'classnames';

import './styles.css';
import languages from './languages';

class LanguageFilter extends React.Component {

  filterInputRef = React.createRef();

  state = {
    selected: '',
    filterText: '',
    selectedIndex: 0,
    showDropdown: false
  };

  focusFilterInput = () => {
    this.filterInputRef.current.focus();
  };

  componentDidUpdate(prevProps, prevState) {
    // only scroll into view if the active item changed since last render
    if (prevState.selectedIndex !== this.state.selectedIndex) {
      this.ensureSelectedVisible();
    }

    // If the dropdown has just been made visible focus the input
    if (this.state.showDropdown && !prevState.showDropdown) {
      this.focusFilterInput();
    }
  }

  ensureSelectedVisible() {
    const itemComponent = this.refs.activeItem;
    if (!itemComponent) {
      return;
    }

    const domNode = ReactDOM.findDOMNode(itemComponent);
    if (!domNode) {
      return;
    }

    domNode.scrollIntoView({ block: 'end' });
  }

  getFilteredLanguages() {
    let availableLanguages = [...languages];

    if (this.state.filterText) {
      availableLanguages = availableLanguages.filter(language => {
        const languageText = language.value.toLowerCase();
        const selectedText = this.state.filterText.toLowerCase();

        return languageText.indexOf(selectedText) >= 0;
      });
    }

    return availableLanguages;
  }

  renderLanguages() {
    let availableLanguages = this.getFilteredLanguages();

    return availableLanguages.map((language, counter) => {
      const isSelectedIndex = counter === this.state.selectedIndex;

      // This will be used in making sure of the element visibility
      const refProp = isSelectedIndex ? { ref: 'activeItem' } : {};

      return (
        <a className={ classNames('select-menu-item', { 'active-item': isSelectedIndex }) }
           { ...refProp }
           key={ counter }>
          <span className="select-menu-item-text">{ language.title }</span>
        </a>
      );
    });
  }

  controlKeys = e => {
    const { selectedIndex } = this.state;

    const isUpKey = e.keyCode === 38;
    const isDownKey = e.keyCode === 40;

    if (!isUpKey && !isDownKey) {
      return;
    }

    e.preventDefault();

    // arrow up/down button should select next/previous list element
    if (isUpKey && selectedIndex > 0) {
      this.setState(prevState => ({
        selectedIndex: prevState.selectedIndex - 1
      }));
    } else if (isDownKey && selectedIndex < (this.getFilteredLanguages().length - 1)) {
      this.setState(prevState => ({
        selectedIndex: prevState.selectedIndex + 1
      }));
    }
  };

  hideDropdown = () => {
    this.setState({
      showDropdown: false,
      filterText: ''
    });
  };

  filterLanguages = (e) => {
    this.setState({
      filterText: e.target.value,
      selectedIndex: 0      // Reset and select the first language
    });
  };

  getLanguageDropdown() {
    return (
      <div className="language-select">
        <div className="select-menu-header">
          <span className="select-menu-title">Search Language</span>
        </div>
        <div className="select-menu-filters">
          <div className="select-menu-text-filter">
            <input type="text"
                   className="form-control"
                   placeholder="Filter Languages"
                   ref={ this.filterInputRef }
                   onBlur={ this.hideDropdown }
                   onChange={ this.filterLanguages }
                   onKeyDown={ this.controlKeys }
            />
          </div>
        </div>
        <div className="select-menu-list">
          { this.renderLanguages() }
        </div>
      </div>
    );
  }

  toggleDropdown = () => {
    this.setState(prevState => ({
      showDropdown: !prevState.showDropdown
    }));
  };

  render() {
    return (
      <div className='language-filter-wrap'>
        <a href="javascript:void(0)" onClick={ this.toggleDropdown } className="btn btn-light language-filter shadowed">
          <i className="fa fa-filter mr-2"></i>
          { this.state.selected || 'All Languages' }
        </a>
        { this.state.showDropdown && this.getLanguageDropdown() }
      </div>
    );
  }
}

export default LanguageFilter;
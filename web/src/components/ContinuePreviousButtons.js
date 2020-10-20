import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ArrowRightIcon from './ArrowRightIcon';
import ArrowLeftIcon from './ArrowLeftIcon';

const continueLabelId = 'continue-button-label';
const previousLabelId = 'previous-button-label';

const ContinuePreviousButtons = ({ continueLink, previousLink }) => {

  const buildLabel = (link) => {
    if (link.url.startsWith('/apd/activity/')) {
      const activityIndex = link.url.split('/')[3];
      return `Activity ${+activityIndex + 1}: ${link.label}`;
    }
    return link.label;
  };

  const continueComponent = !continueLink ? null : (
    <Link
      aria-labelledby={continueLabelId}
      className="ds-c-button ds-c-button--primary ds-u-float--right"
      to={continueLink.url}
    >
      Continue
      <ArrowRightIcon className="ds-u-margin-left--1" />
    </Link>
  );

  const continueLabel = !continueLink ? null : (
    <p className="ds-u-text-align--right" id={continueLabelId}>
      {buildLabel(continueLink)}
    </p>
  );

  const previousComponent = !previousLink ? null : (
    <Link
      aria-labelledby={previousLabelId}
      className="ds-c-button"
      to={previousLink.url}
    >
      <ArrowLeftIcon className="ds-u-margin-right--1" />
      Previous
    </Link>
  );

  const previousLabel = !previousLink ? null : (
    <p id={previousLabelId}>{buildLabel(previousLink)}</p>
  );

  return (
    <React.Fragment>
      <div className="ds-l-row ds-u-justify-content--between">
        <div className="ds-l-col--6">{previousComponent}</div>
        <div className="ds-l-col--6 ds-u-clearfix">{continueComponent}</div>
      </div>

      <div className="ds-l-row ds-u-justify-content--between">
        <div className="ds-l-col--6">{previousLabel}</div>
        <div className="ds-l-col--6">{continueLabel}</div>
      </div>
    </React.Fragment>
  );
};

ContinuePreviousButtons.defaultProps = {
  continueLink: null,
  previousLink: null
};

ContinuePreviousButtons.propTypes = {
  continueLink: PropTypes.object,
  previousLink: PropTypes.object
};

const mapStateToProps = ({ nav }) => ({
  continueLink: nav.continueLink,
  previousLink: nav.previousLink
});

export default connect(mapStateToProps)(ContinuePreviousButtons);

export {
  continueLabelId,
  previousLabelId,
  ContinuePreviousButtons as plain,
  mapStateToProps
};
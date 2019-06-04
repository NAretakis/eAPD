import { Button } from '@cmsgov/design-system-core';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Waypoint from './ConnectedWaypoint';
import { printApd } from '../actions/print';
import { Section } from '../components/Section';
import { FileDownload } from '../components/Icons';

const ExportAndSubmit = ({ printApd: print }) => (
  <Waypoint id="export-and-submit">
    <Section isNumbered id="export-and-submit" resource="exportAndSubmit">
    <h3>Download</h3>
      <p>
        Download a copy of your APD to review your work offline or as the first
        step in submitting a completed APD to CMS. If you make changes, follow these
        steps again at any time to download a new PDF.
      </p>
      <ol>
        <li>
          Select <strong>Export</strong> to open up your browser’s print
          options window. For longer PDFs this may take a few seconds.
        </li>
        <li>
          In the print window, select your PDF printer or Save to PDF, depending
          on the options your browser offers.
        </li>
        <li>
          If prompted, provide a file name for the PDF. Then to download or open
          it, select <strong>OK</strong> or <strong>Save</strong>.
        </li>
      </ol>
      <Button
        size="big"
        variation="primary"
        className="ds-u-margin-top--2"
        onClick={print}
      >
        Export
        <span className="ds-u-margin-left--2">
          <FileDownload />
        </span>
      </Button>

    <h3>Submit to CMS</h3>
      <p>
        Once you’ve exported a PDF of a completed APD, submit it for state officer
        review by emailing the PDF to <a href="mailto:MedicaidHITECH@cms.hhs.gov">MedicaidHITECH@cms.hhs.gov</a>.
      </p>

    </Section>
  </Waypoint>
);

ExportAndSubmit.propTypes = {
  printApd: PropTypes.func.isRequired
};

const mapDispatchToProps = { printApd };

export default connect(
  null,
  mapDispatchToProps
)(ExportAndSubmit);

export { ExportAndSubmit as plain, mapDispatchToProps };
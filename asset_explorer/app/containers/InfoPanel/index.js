/**
 *
 * InfoPanel
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { ProgressBar, View, Content } from '@adobe/react-spectrum';

import { makeSelectInfoPanelIsOpen } from './selectors';
import reducer from './reducer';
import saga from './saga';

import { closeInfoPanel } from './actions';
import InfoHeading from '../../components/InfoHeading';
import ContactCard from '../../components/ContactCard';
import {
  makeSelectExplorerCurrentAsset,
  makeSelectExplorerLoadingCurrentAsset,
} from '../Explorer/selectors';
import { assetSchema } from '../../schemas';
import WelcomeInfo from '../../components/WelcomeInfo';
import InfoSection from '../../components/InfoSection';
import InfoLine from '../../components/InfoLine';

export function InfoPanel({ isOpen, loading, asset }) {
  useInjectReducer({ key: 'infoPanel', reducer });
  useInjectSaga({ key: 'infoPanel', saga });
  let url = '';
  let statusList;

  if (asset) {
    if (asset.url)
      url = asset.url.match(/^[a-zA-Z]+:\/\//)
        ? asset.url
        : `https://${asset.url}`;

    statusList = [
      {
        name: 'Open to the Public',
        status: asset.openToPublic,
      },
      {
        name: 'Child Friendly',
        status: asset.childFriendly,
      },
      {
        name: 'Public Internet Access',
        status: asset.internetAccess,
        disabledMsg: 'No Public Internet Access',
      },
      {
        name: 'Computers Available',
        status: asset.computersAvailable,
        disabledMsg: 'No Public Computers Available',
      },
    ];
  }

  return (
    <View padding="size-150" position="relative">
      {loading && <ProgressBar label="Loading…" isIndeterminate />}
      {!loading && !asset && <WelcomeInfo />}
      {!loading && asset && (
        <>
          <InfoHeading
            name={asset.name}
            assetTypes={asset.assetTypes}
            category={asset.category}
            address={asset.location.properties.name}
          />
          <Content>
            <InfoSection title="Contact Information">
              <ContactCard
                email={asset.email}
                phone={asset.phone}
                website={url}
                address={asset.location.properties.name}
              />
            </InfoSection>

            <InfoSection title="Hours of Operation">
              <InfoLine term="Regular" value={asset.hoursOfOperation} />
              <InfoLine term="Holiday" value={asset.holidayHoursOfOperation} />
            </InfoSection>
            <InfoSection title="Internet">
              <InfoLine term="WiFi Network" value={asset.wifiNetwork} />
            </InfoSection>
            <InfoSection title="Metadata">
              <InfoLine
                term="Date Added"
                value={new Date(asset.dateEntered).toLocaleString('en')}
              />
              <InfoLine
                term="Last Updated"
                value={new Date(asset.lastUpdated).toLocaleString('en')}
              />
            </InfoSection>
          </Content>
        </>
      )}
    </View>
  );
}

InfoPanel.propTypes = {
  isOpen: PropTypes.bool,
  loading: PropTypes.bool,
  asset: PropTypes.shape(assetSchema),
};

const mapStateToProps = createStructuredSelector({
  isOpen: makeSelectInfoPanelIsOpen(),
  loading: makeSelectExplorerLoadingCurrentAsset(),
  asset: makeSelectExplorerCurrentAsset(),
});

function mapDispatchToProps(dispatch) {
  return {
    handleClose: () => dispatch(closeInfoPanel()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(InfoPanel);

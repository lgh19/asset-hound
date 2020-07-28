/**
 *
 * WelcomeInfo
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  View,
  Heading,
  Header,
  Link,
  ListBox,
  Item,
  Text,
} from '@adobe/react-spectrum';
import messages from './messages';

function WelcomeInfo() {
  return (
    <View>
      <Heading level={2}>
        <FormattedMessage {...messages.header} />
      </Heading>
      <View>
        <Text>
          This map is very much a work in progress, and is designed to help
          people implement asset-based community outreach strategies for the
          2020 Census. We’re starting by assembling as much data about community
          assets as we can from local, state, and federal data sources that
          we’re able to access. Over the next few months, we’ll add additional
          data sources, clean and code some of the existing data, and add new
          features to the tool. We’ll provide regular updates in our road map
          document.
        </Text>
      </View>
      <View>
        <Text>
          We’ll also learn more about additional asset mapping efforts happening
          in our region, and we’ll also will engage people in many different
          communities to learn more about what they consider to be assets, and
          how they might use this tool to tell an asset-based story about their
          neighborhood. We’ll also spend some time trying to figure-out how we
          can continue to keep the information behind the map up to date in the
          most-efficient way possible, and develop a strategy for how we can
          financially sustain this work.
        </Text>
      </View>
      <View>
        <Text>
          If you have any suggestions or feedback, we’d love to hear from you.
          Please drop us a line at{' '}
          <Link href="mailto:wprdc@pitt.edu?subject=Asset Map">
            wprdc@pitt.edu.
          </Link>
        </Text>
      </View>
    </View>
  );
}

WelcomeInfo.propTypes = {};

export default memo(WelcomeInfo);

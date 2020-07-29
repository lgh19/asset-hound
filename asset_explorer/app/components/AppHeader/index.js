/**
 *
 * AppHeader
 *
 * App-level AppHeader
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Text,
  Header,
  Heading,
  ActionButton,
  Flex,
  View,
  Divider,
  Provider,
} from '@adobe/react-spectrum';
import Light from '@spectrum-icons/workflow/Light';
import Moon from '@spectrum-icons/workflow/Moon';

import FileData from '@spectrum-icons/workflow/FileData';

function AppHeader({ colorScheme, onDarkModeChange }) {
  const inDarkMode = colorScheme === 'dark';

  return (
    <Provider backgroundColor="gold-400">
      <Header role="banner">
        <Flex direction="column" height="size-1000">
          <Flex direction="row" flex>
            <View flex="1 0 auto" padding="size-250">
              <Heading level={2} margin={0}>
                Asset Map
              </Heading>
            </View>
            <View flex="0 1 auto" padding="size-250">
              <Button
                elementType="a"
                variant="primary"
                href="https://data.wprdc.org/dataset/allegheny-county-assets"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileData />
                <Text>Get the Data Here!</Text>
              </Button>
            </View>
            <View flex="0 1 auto" padding="size-250" aria-hidden>
              <ActionButton
                onPress={() => onDarkModeChange(!inDarkMode)}
                aria-hidden
                title="Toggle Dark Mode"
              >
                {inDarkMode ? <Light size="L" /> : <Moon size="L" />}
              </ActionButton>
            </View>
          </Flex>
          <Divider />
        </Flex>
      </Header>
    </Provider>
  );
}

AppHeader.propTypes = {
  colorScheme: PropTypes.string,
  onDarkModeChange: PropTypes.func.isRequired,
};

export default memo(AppHeader);

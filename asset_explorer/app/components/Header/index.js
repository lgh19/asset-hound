/**
 *
 * Header
 *
 * App-level Header
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
  Item,
  Flex,
  View,
  ActionGroup,
  ButtonGroup,
  Provider,
  defaultTheme,
  Divider,
} from '@adobe/react-spectrum';
import Light from '@spectrum-icons/workflow/Light';
import Moon from '@spectrum-icons/workflow/Moon';

import FileData from '@spectrum-icons/workflow/FileData';

const BG_COLOR = 'gold-400';

function AppHeader({ darkMode, onDarkModeChange }) {
  return (
    <Header component="header" position="static" width="100%" role="banner">
      <Flex direction="row" width="100%">
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
        <View
          flex="0 1 auto"
          padding="size-250"
          aria-hidden
          backgroundColor={BG_COLOR}
        >
          <ActionButton isQuiet onClick={() => onDarkModeChange(!darkMode)}>
            {!darkMode ? <Moon /> : <Light />}
          </ActionButton>
        </View>
      </Flex>
      <Divider />
    </Header>
  );
}

AppHeader.propTypes = {
  darkMode: PropTypes.bool,
  onDarkModeChange: PropTypes.func.isRequired,
};

export default memo(AppHeader);

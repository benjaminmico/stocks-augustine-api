#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { CodeStack } from '../lib';

const app = new App();
new CodeStack(app, 'Wondercode-CodeStack');

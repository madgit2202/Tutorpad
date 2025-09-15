/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const SplashScreen = () => {
  return (
    <div className="splash-screen" aria-hidden="true">
      <div className="pulsar-loader">
        <div className="pulsar-ring"></div>
        <div className="pulsar-ring"></div>
        <div className="pulsar-ring"></div>
        <div className="pulsar-ring"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
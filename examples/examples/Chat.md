```js
import React from 'react';

import { AmityUiKitProvider, AmityUiKitChat } from '@amityco/ui-kit';

export default App = () => {
  return (
    <div className="App">
      <AmityUiKitProvider
        apiKey={apiKey}
        userId={userId}
        displayName={displayName}
        // apiEndpoint={apiEndpoint} not required if using default endpoints
        apiRegion={apiRegion}
      >
        <AmityUiKitChat />
      </AmityUiKitProvider>
      )}
    </div>
  );
};
```

import React, { useState } from 'react';
import Recipes from './Recipes';

function App() {
    const [vegetarian, setVegetarian] = useState(false);

    return (
        <div>
            <label>
                Vegetarian?
                <input type="checkbox" value={vegetarian} onChange={e => setVegetarian(e.target.checked)} />
            </label>
            <Recipes vegetarian={vegetarian} />
        </div>
    );
}

export default App;

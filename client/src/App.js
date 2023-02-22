import React, { useState } from 'react';
import AddRecipe from './AddRecipe';
import Recipes from './Recipes';

function App() {
    const [vegetarian, setVegetarian] = useState(false);

    return (
        <div className="App">
            <AddRecipe />

            <br /><hr /><br />

            <label className="vegetarian-check">
                Vegetarian?
                <input type="checkbox" value={vegetarian} onChange={e => setVegetarian(e.target.checked)} />
            </label>

            <Recipes vegetarian={vegetarian} />
        </div>
    );
}

export default App;

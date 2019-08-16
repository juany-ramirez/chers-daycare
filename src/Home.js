import React from 'react'
import { 
    PrimaryHeaderLarge,
    PrimaryHeaderMedium,
    PrimaryHeaderSmall,
    TextLarge,
    TextMedium,
    TextSmall,
    NewPost} from './components'
import { Post } from './module/Post'


export const Home = () => (
    <div className="daycare-home-page">
        <br/><br/><br/><br/><br/><br/><br/>
        {/* <PrimaryHeaderLarge title='Hello world' color='#F2D95E'></PrimaryHeaderLarge>
        <br/>
        <PrimaryHeaderLarge title='Hello world' ></PrimaryHeaderLarge>
        <br/>
        <PrimaryHeaderMedium title='Hello world' ></PrimaryHeaderMedium>
        <br/>
        <PrimaryHeaderSmall title='Hello world' ></PrimaryHeaderSmall>
        <br/>
        <TextLarge title='Hello world' ></TextLarge>
        <br/>
        <TextMedium title='Hello world' ></TextMedium>
        <br/>
        <TextSmall title='Hello world' ></TextSmall>
        <br/> */}
        <NewPost></NewPost>
        <br/>
        <Post></Post>
        <br/>
        <Post></Post>
        <br/>
    </div>
)
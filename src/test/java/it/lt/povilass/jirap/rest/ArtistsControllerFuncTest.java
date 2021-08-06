package it.lt.povilass.jirap.rest;

import org.junit.Test;
import org.junit.After;
import org.junit.Before;

import lt.povilass.jirap.rest.dto.ArtistsDto;
import org.apache.wink.client.Resource;
import org.apache.wink.client.RestClient;

public class ArtistsControllerFuncTest {

    @Before
    public void setup() {

    }

    @After
    public void tearDown() {

    }

    @Test
    public void messageIsValid() {

        String baseUrl = System.getProperty("baseurl");
        String resourceUrl = baseUrl + "/rest/artists/v1/message";

        RestClient client = new RestClient();
        Resource resource = client.resource(resourceUrl);

        ArtistsDto message = resource.get(ArtistsDto.class);

    }
}

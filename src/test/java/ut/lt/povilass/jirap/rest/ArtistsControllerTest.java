package ut.lt.povilass.jirap.rest;


import com.atlassian.cache.Cache;
import lt.povilass.jirap.rest.ArtistsResource;
import lt.povilass.jirap.rest.dto.ArtistsDto;
import lt.povilass.jirap.service.ArtistsService;
import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Test;
import org.junit.After;
import org.junit.Before;

import org.mockito.Mock;

public class ArtistsControllerTest {

    @Mock
    private ArtistsService artistsService;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private Cache<String, ArtistsDto> cache;

    @Before
    public void setup() {

    }

    @After
    public void tearDown() {

    }

    @Test
    public void messageIsValid() {
        ArtistsResource controller = new ArtistsResource(artistsService, objectMapper, cache);
    }
}
